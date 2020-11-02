const perf_hooks = require('perf_hooks'); 
// cSpell:ignore nisse, mnpwr


import "mocha";


import sinon from "sinon";

import { expect } from "chai";


import http from "http";

import express from "express";

import bodyParser from "body-parser";


import { ProxyFacade } from "./proxy.facade";


import { AddressInfo } from "net";

import { NtlmConfig } from "../../src/models/ntlm.config.model";

import { DependencyInjection } from "../../src/proxy/dependency.injection";

import { ICoreServer } from "../../src/proxy/interfaces/i.core.server";

import { TYPES } from "../../src/proxy/dependency.injection.types";


let _configApiUrl: string | undefined;


let remoteHost = express();

let remoteHostRequestHeaders: http.IncomingHttpHeaders[];

let remoteHostResponseWwwAuthHeaders: string[];

let remoteHostReply: number;

let remoteHostListener: http.Server | undefined;

let remoteHostWithPort: string;


async function initRemoteHost() 
{
  
remoteHost.use(bodyParser.raw());
  
remoteHostReply = 401;
  
remoteHost.use((req, res) => 
{
    
remoteHostRequestHeaders.push(req.headers);
    
if (remoteHostResponseWwwAuthHeaders.length) 
{
      
let header = remoteHostResponseWwwAuthHeaders.shift();
      
res.setHeader("www-authenticate", header);
    }
    
res.sendStatus(remoteHostReply);
  })
;

  
remoteHostListener = await new Promise<http.Server>((resolve, reject) => 
{
    
let listener = remoteHost.listen((err: Error) => 
{
      
if (err) 
{
        
reject(err);
      }
    })
;
    
resolve(listener);
  })
;
  
if (remoteHostListener) 
{
    
let addressInfo = remoteHostListener.address() as AddressInfo;
    
remoteHostWithPort = "http://localhost:" + addressInfo.port;
  } 
else
{
    
throw new Error("Could not start test server");
  }
}


describe("NTLM Proxy authentication", function () 
{
  
let proxyFacade = new ProxyFacade();
  
let coreServer: ICoreServer;
  
let dependencyInjection = new DependencyInjection();

  
before(async function () 
{
    
this.timeout(30000);
    
await proxyFacade.initMitmProxy();
    
await initRemoteHost();
  })
;

  
beforeEach(function () 
{
    
this.timeout(2000);
    
coreServer = dependencyInjection.get<ICoreServer>(TYPES.ICoreServer);
    
_configApiUrl = undefined;
    
remoteHostRequestHeaders = [];
    
remoteHostResponseWwwAuthHeaders = ["NTLM"];
  })
;

  
afterEach(async function () 
{
    
if (_configApiUrl) 
{
      // Shutdown the proxy listeners to allow a clean exit
      
await ProxyFacade.sendQuitCommand(_configApiUrl, true);
      
_configApiUrl = undefined;
    }
  })
;

  
after(function () 
{
    
if (remoteHostListener) 
{
      
remoteHostListener.close();
    }
  })
;

  
it("proxy without configuration shall not add authentication header", async function () 
{
    // Act
    
let ports = await coreServer.start(undefined, undefined, undefined);
    
_configApiUrl = ports.configApiUrl;
    
let res = await ProxyFacade.sendRemoteRequest(
      ports.ntlmProxyUrl,
      remoteHostWithPort,
      "GET",
      "/test",
      null
    );
    
expect(res.status).to.be.equal(401);
    
expect(remoteHostRequestHeaders.length).to.be.equal(1);
    
let firstRequestHeaders = remoteHostRequestHeaders.shift();
    
expect(firstRequestHeaders).to.be.not.null;
    
expect(firstRequestHeaders && "authorization" in firstRequestHeaders).to.be
      .false;
  })
;

  
it("proxy with configuration shall not add authentication header without challenge", async function () 
{
    // Arrange
    
const hostConfig: NtlmConfig = {
      ntlmHosts: [remoteHostWithPort.replace("http://", "")],
      username: "nisse",
      password: "manpower",
      domain: "mnpwr",
      ntlmVersion: 2,
    };
    
remoteHostResponseWwwAuthHeaders = [];

    // Act
    

var TIMING_TEMP_VAR_AUTOGEN159__RANDOM = perf_hooks.performance.now();
 var AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN159__RANDOM = await  coreServer.start(undefined, undefined, undefined);
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/ntlm.proxy.spec.ts& [120, 4; 120, 72]& TEMP_VAR_AUTOGEN159__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN159__RANDOM));
 let ports =  AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN159__RANDOM
    
_configApiUrl = ports.configApiUrl;
    
let res = await ProxyFacade.sendNtlmConfig(ports.configApiUrl, hostConfig);
    
expect(res.status).to.be.equal(200);

    
res = await ProxyFacade.sendRemoteRequest(
      ports.ntlmProxyUrl,
      remoteHostWithPort,
      "GET",
      "/test",
      null
    );
    
expect(res.status).to.be.equal(401);
    
expect(remoteHostRequestHeaders.length).to.be.equal(1);
    
let firstRequestHeaders = remoteHostRequestHeaders.shift();
    
expect(firstRequestHeaders).to.be.not.null;
    
expect(firstRequestHeaders && "authorization" in firstRequestHeaders).to.be
      .false;
  })
;

  
it("proxy with configuration shall add authentication header", async function () 
{
    // Arrange
    
const hostConfig: NtlmConfig = {
      ntlmHosts: [remoteHostWithPort.replace("http://", "")],
      username: "nisse",
      password: "manpower",
      domain: "mnpwr",
      ntlmVersion: 2,
    };
    
remoteHostResponseWwwAuthHeaders.push("test");

    // Act
    

var TIMING_TEMP_VAR_AUTOGEN179__RANDOM = perf_hooks.performance.now();
 var AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN179__RANDOM = await  coreServer.start(undefined, undefined, undefined);
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/ntlm.proxy.spec.ts& [152, 4; 152, 72]& TEMP_VAR_AUTOGEN179__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN179__RANDOM));
 let ports =  AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN179__RANDOM
    
_configApiUrl = ports.configApiUrl;
    
let res = await ProxyFacade.sendNtlmConfig(ports.configApiUrl, hostConfig);
    
expect(res.status).to.be.equal(200);

    
res = await ProxyFacade.sendRemoteRequest(
      ports.ntlmProxyUrl,
      remoteHostWithPort,
      "GET",
      "/test",
      null
    );
    
expect(res.status).to.be.equal(401);
    
expect(remoteHostRequestHeaders.length).to.be.equal(2);
    
remoteHostRequestHeaders.shift();
    
let firstRequestHeaders = remoteHostRequestHeaders.shift();
    
expect(firstRequestHeaders).to.be.not.null;
    
expect(firstRequestHeaders && "authorization" in firstRequestHeaders).to.be
      .true;
  })
;

  
it("proxy with configuration shall not add authentication header for another host", async function () 
{
    // Arrange
    
const hostConfig: NtlmConfig = {
      ntlmHosts: ["some.other.host.com:4567"],
      username: "nisse",
      password: "manpower",
      domain: "mnpwr",
      ntlmVersion: 2,
    };

    // Act
    

var TIMING_TEMP_VAR_AUTOGEN185__RANDOM = perf_hooks.performance.now();
 var AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN185__RANDOM = await  coreServer.start(undefined, undefined, undefined);
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/ntlm.proxy.spec.ts& [184, 4; 184, 72]& TEMP_VAR_AUTOGEN185__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN185__RANDOM));
 let ports =  AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN185__RANDOM
    
_configApiUrl = ports.configApiUrl;
    
let res = await ProxyFacade.sendNtlmConfig(ports.configApiUrl, hostConfig);
    
expect(res.status).to.be.equal(200);

    
res = await ProxyFacade.sendRemoteRequest(
      ports.ntlmProxyUrl,
      remoteHostWithPort,
      "GET",
      "/test",
      null
    );
    
expect(res.status).to.be.equal(401);
    
expect(remoteHostRequestHeaders.length).to.be.equal(1);
    
let firstRequestHeaders = remoteHostRequestHeaders.shift();
    
expect(firstRequestHeaders).to.be.not.null;
    
expect(firstRequestHeaders && "authorization" in firstRequestHeaders).to.be
      .false;
  })
;

  
it("proxy shall not add authentication header after reset", async function () 
{
    // Arrange
    
const hostConfig: NtlmConfig = {
      ntlmHosts: [remoteHostWithPort.replace("http://", "")],
      username: "nisse",
      password: "manpower",
      domain: "mnpwr",
      ntlmVersion: 2,
    };

    // Act
    

var TIMING_TEMP_VAR_AUTOGEN191__RANDOM = perf_hooks.performance.now();
 var AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN191__RANDOM = await  coreServer.start(undefined, undefined, undefined);
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/ntlm.proxy.spec.ts& [215, 4; 215, 72]& TEMP_VAR_AUTOGEN191__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN191__RANDOM));
 let ports =  AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN191__RANDOM
    
_configApiUrl = ports.configApiUrl;
    
let res = await ProxyFacade.sendNtlmConfig(ports.configApiUrl, hostConfig);
    
expect(res.status).to.be.equal(200);

    
await ProxyFacade.sendNtlmReset(ports.configApiUrl);

    
res = await ProxyFacade.sendRemoteRequest(
      ports.ntlmProxyUrl,
      remoteHostWithPort,
      "GET",
      "/test",
      null
    );
    
expect(res.status).to.be.equal(401);
    
expect(remoteHostRequestHeaders.length).to.be.equal(1);
    
let firstRequestHeaders = remoteHostRequestHeaders.shift();
    
expect(firstRequestHeaders).to.be.not.null;
    
expect(firstRequestHeaders && "authorization" in firstRequestHeaders).to.be
      .false;
  })
;

  
it("proxy shall return error but keep working after incoming non-proxy request", async function () 
{
    
const hostConfig: NtlmConfig = {
      ntlmHosts: [remoteHostWithPort.replace("http://", "")],
      username: "nisse",
      password: "manpower",
      domain: "mnpwr",
      ntlmVersion: 2,
    };
    

var TIMING_TEMP_VAR_AUTOGEN207__RANDOM = perf_hooks.performance.now();
 var AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN207__RANDOM = await  coreServer.start(undefined, undefined, undefined);
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/ntlm.proxy.spec.ts& [245, 4; 245, 72]& TEMP_VAR_AUTOGEN207__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN207__RANDOM));
 let ports =  AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN207__RANDOM
    
_configApiUrl = ports.configApiUrl;

    
let res = await ProxyFacade.sendNtlmConfig(
      ports.ntlmProxyUrl,
      hostConfig,
      250
    );
    
expect(res.status).to.be.equal(504);

    
res = await ProxyFacade.sendRemoteRequest(
      ports.ntlmProxyUrl,
      remoteHostWithPort,
      "GET",
      "/test",
      null
    );
    
expect(res.status).to.be.equal(401);
  })
;
})
;
