const perf_hooks = require('perf_hooks'); 
// cSpell:ignore nisse, mptst

// This test binds to the default HTTP and HTTPS ports (80 and 443),
// which requires admin priveliges on many platforms. Hence it must
// be run manually. On OS X, you can use (from the project root)
// sudo node_modules/.bin/mocha --require ./test/ts.hooks.js --require source-map-support/register test/manual/standard.ports.manual.test.ts


import "mocha";


import { ProxyFacade } from "../proxy/proxy.facade";

import { expect } from "chai";

import { DependencyInjection } from "../../src/proxy/dependency.injection";

import { TYPES } from "../../src/proxy/dependency.injection.types";

import { ExpressServer } from "../proxy/express.server";

import sinon from "sinon";

import { PortsFileService } from "../../src/util/ports.file.service";

import { ICoreServer } from "../../src/proxy/interfaces/i.core.server";

import { PortsFile } from "../../src/models/ports.file.model";

import { NtlmConfig } from "../../src/models/ntlm.config.model";


let configApiUrl: string;

let ntlmProxyUrl: string;

let savePortsFileStub: sinon.SinonStub<[PortsFile], Promise<void>>;

let portsFileExistsStub: sinon.SinonStub<[], boolean>;


describe("Proxy for HTTP host on port 80 with NTLM", function () 
{
  
let ntlmHostConfig: NtlmConfig;
  
let dependencyInjection = new DependencyInjection();
  
let proxyFacade = new ProxyFacade();
  
let expressServer = new ExpressServer();
  
let coreServer: ICoreServer;
  
let httpUrl: string;

  
before("Start HTTP server and proxy", async function () 
{
    
savePortsFileStub = sinon.stub(PortsFileService.prototype, "save");
    
portsFileExistsStub = sinon.stub(PortsFileService.prototype, "exists");
    
portsFileExistsStub.returns(false);
    
savePortsFileStub.returns(Promise.resolve());

    
this.timeout(30000);
    
await proxyFacade.initMitmProxy();
    
httpUrl = await expressServer.startHttpServer(false, 80);
    
ntlmHostConfig = {
      ntlmHost: httpUrl,
      username: "nisse",
      password: "manpower",
      domain: "mptst",
      ntlmVersion: 2,
    };
    
coreServer = dependencyInjection.get<ICoreServer>(TYPES.ICoreServer);
    
let ports = await coreServer.start(undefined, undefined, undefined);
    
configApiUrl = ports.configApiUrl;
    
ntlmProxyUrl = ports.ntlmProxyUrl;
  })
;

  
after("Stop HTTP server and proxy", async function () 
{
    
var TEMP_VAR_AUTOGEN113__RANDOM =  coreServer.stop();

if (savePortsFileStub) 
{
      
savePortsFileStub.restore();
    }
    
if (portsFileExistsStub) 
{
      
portsFileExistsStub.restore();
    }

    

var TIMING_TEMP_VAR_AUTOGEN113__RANDOM = perf_hooks.performance.now();
 await  TEMP_VAR_AUTOGEN113__RANDOM
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/manual/standard.ports.manual.test.ts& [63, 4; 63, 28]& TEMP_VAR_AUTOGEN113__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN113__RANDOM));
  

    
await expressServer.stopHttpServer();
  })
;

  
beforeEach("Reset NTLM config", async function () 
{
    
this.timeout(5000);
    
await ProxyFacade.sendNtlmReset(configApiUrl);
    
ntlmHostConfig.ntlmHost = httpUrl;
  })
;

  
it("should handle authentication for GET requests when config includes port", async function () 
{
    
ntlmHostConfig.ntlmHost = "http://localhost:80";
    
let res = await ProxyFacade.sendNtlmConfig(configApiUrl, ntlmHostConfig);
    
expect(res.status).to.be.equal(200);
    
res = await ProxyFacade.sendRemoteRequest(
      ntlmProxyUrl,
      httpUrl,
      "GET",
      "/get",
      null
    );
    
expect(res.status).to.be.equal(200);
    
let resBody = res.data as any;
    
expect(resBody.reply).to.be.equal("OK ÅÄÖéß");
  })
;

  
it("should handle authentication for GET requests when config excludes port", async function () 
{
    
ntlmHostConfig.ntlmHost = "http://localhost";
    
let res = await ProxyFacade.sendNtlmConfig(configApiUrl, ntlmHostConfig);
    
expect(res.status).to.be.equal(200);
    
res = await ProxyFacade.sendRemoteRequest(
      ntlmProxyUrl,
      httpUrl,
      "GET",
      "/get",
      null
    );
    
expect(res.status).to.be.equal(200);
    
let resBody = res.data as any;
    
expect(resBody.reply).to.be.equal("OK ÅÄÖéß");
  })
;
})
;


describe("Proxy for HTTPS host on port 443 with NTLM", function () 
{
  
let ntlmHostConfig: NtlmConfig;
  
let dependencyInjection = new DependencyInjection();
  
let proxyFacade = new ProxyFacade();
  
let expressServer = new ExpressServer();
  
let coreServer: ICoreServer;
  
let httpsUrl: string;

  
before("Start HTTPS server and proxy", async function () 
{
    
savePortsFileStub = sinon.stub(PortsFileService.prototype, "save");
    
portsFileExistsStub = sinon.stub(PortsFileService.prototype, "exists");
    
portsFileExistsStub.returns(false);
    
savePortsFileStub.returns(Promise.resolve());

    
this.timeout(30000);
    
await proxyFacade.initMitmProxy();
    
httpsUrl = await expressServer.startHttpsServer(false, 443);
    
ntlmHostConfig = {
      ntlmHost: httpsUrl,
      username: "nisse",
      password: "manpower",
      domain: "mptst",
      ntlmVersion: 2,
    };
    
coreServer = dependencyInjection.get<ICoreServer>(TYPES.ICoreServer);
    
let ports = await coreServer.start(undefined, undefined, undefined);
    
configApiUrl = ports.configApiUrl;
    
ntlmProxyUrl = ports.ntlmProxyUrl;
  })
;

  
after("Stop HTTPS server and proxy", async function () 
{
    
if (savePortsFileStub) 
{
      
savePortsFileStub.restore();
    }
    
if (portsFileExistsStub) 
{
      
portsFileExistsStub.restore();
    }

    
coreServer.stop(true);
    
await expressServer.stopHttpsServer();
  })
;

  
beforeEach("Reset NTLM config", async function () 
{
    
this.timeout(5000);
    
ProxyFacade.sendNtlmReset(configApiUrl);
    
ntlmHostConfig.ntlmHost = httpsUrl;
  })
;

  
it("should handle authentication for GET requests when config includes port", async function () 
{
    
ntlmHostConfig.ntlmHost = "https://localhost:443";
    
let res = await ProxyFacade.sendNtlmConfig(configApiUrl, ntlmHostConfig);
    
expect(res.status).to.be.equal(200);
    
res = await ProxyFacade.sendRemoteRequest(
      ntlmProxyUrl,
      httpsUrl,
      "GET",
      "/get",
      null,
      proxyFacade.mitmCaCert
    );
    
expect(res.status).to.be.equal(200);
    
let resBody = res.data as any;
    
expect(resBody.reply).to.be.equal("OK ÅÄÖéß");
  })
;

  
it("should handle authentication for GET requests when config excludes port", async function () 
{
    
ntlmHostConfig.ntlmHost = "https://localhost";
    
let res = await ProxyFacade.sendNtlmConfig(configApiUrl, ntlmHostConfig);
    
expect(res.status).to.be.equal(200);
    
res = await ProxyFacade.sendRemoteRequest(
      ntlmProxyUrl,
      httpsUrl,
      "GET",
      "/get",
      null,
      proxyFacade.mitmCaCert
    );
    
expect(res.status).to.be.equal(200);
    
let resBody = res.data as any;
    
expect(resBody.reply).to.be.equal("OK ÅÄÖéß");
  })
;
})
;
