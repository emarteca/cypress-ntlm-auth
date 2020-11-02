const perf_hooks = require('perf_hooks'); 
// cSpell:ignore nisse, mnpwr, mptest

import "reflect-metadata";

import "mocha";

import { Substitute, SubstituteOf, Arg } from "@fluffy-spoon/substitute";


import { expect } from "chai";

import { ConfigServer } from "../../src/proxy/config.server";

import { IConfigController } from "../../src/proxy/interfaces/i.config.controller";

import { IExpressServerFacade } from "../../src/proxy/interfaces/i.express.server.facade";

import { IDebugLogger } from "../../src/util/interfaces/i.debug.logger";

import { DebugLogger } from "../../src/util/debug.logger";

import { PortsConfigStoreMock } from "./ports.config.store.mock";


describe("ConfigServer", () => 
{
  
let configServer: ConfigServer;
  
let configControllerMock: SubstituteOf<IConfigController>;
  
let portsConfigStoreMock: PortsConfigStoreMock;
  
let expressServerMock: SubstituteOf<IExpressServerFacade>;
  
let debugMock: SubstituteOf<IDebugLogger>;
  
let debugLogger = new DebugLogger();

  
beforeEach(function () 
{
    
configControllerMock = Substitute.for<IConfigController>();
    
portsConfigStoreMock = new PortsConfigStoreMock();
    
expressServerMock = Substitute.for<IExpressServerFacade>();
    
debugMock = Substitute.for<IDebugLogger>();
    
debugMock.log(Arg.all()).mimicks(debugLogger.log);
    
configServer = new ConfigServer(
      expressServerMock,
      configControllerMock,
      portsConfigStoreMock,
      debugMock
    );
  })
;

  
it("start should use a free port if undefined", async function () 
{
    
var TEMP_VAR_AUTOGEN38__RANDOM =  configServer.start();

let listenPort: any;
    
expressServerMock.listen(Arg.all()).mimicks((port: any) => 
{
      
listenPort = port;
      
return Promise.resolve("http://127.0.0.1:" + port);
    })
;

    

var TIMING_TEMP_VAR_AUTOGEN38__RANDOM = perf_hooks.performance.now();
 await  TEMP_VAR_AUTOGEN38__RANDOM
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/config.server.shallow.spec.ts& [42, 4; 42, 31]& TEMP_VAR_AUTOGEN38__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN38__RANDOM));
  

    
expressServerMock.received(1).listen(Arg.any());
    
expect(portsConfigStoreMock.configApiUrl).to.eq(
      "http://127.0.0.1:" + listenPort
    );
    
expect(listenPort).to.be.greaterThan(0);
  })
;

  
it("start should call init", async function () 
{
    
var TEMP_VAR_AUTOGEN90__RANDOM =  configServer.start();

expressServerMock
      .listen(Arg.any())
      .returns(Promise.resolve("http://127.0.0.1:2000"));

    

var TIMING_TEMP_VAR_AUTOGEN90__RANDOM = perf_hooks.performance.now();
 await  TEMP_VAR_AUTOGEN90__RANDOM
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/config.server.shallow.spec.ts& [55, 4; 55, 31]& TEMP_VAR_AUTOGEN90__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN90__RANDOM));
  


    
expressServerMock.received(1).use(Arg.any(), Arg.any());
  })
;

  
it("start should throw if listen fails", async function () 
{
    
expressServerMock.listen(Arg.all()).mimicks((port: any) => 
{
      
return Promise.reject("test");
    })
;

    
await expect(configServer.start()).to.be.rejectedWith("test");
  })
;

  
it("init should just initialize once", function () 
{
    
configServer.init();
    
expressServerMock.received(1).use(Arg.any(), Arg.any());

    
configServer.init();
    
expressServerMock.received(1).use(Arg.any(), Arg.any());
  })
;

  
it("stop should close server listener", async function () 
{
    
var TEMP_VAR_AUTOGEN139__RANDOM =  configServer.start();

expressServerMock
      .listen(Arg.any())
      .returns(Promise.resolve("http://127.0.0.1:2000"));
    
expressServerMock.close().returns(Promise.resolve());
    

var TIMING_TEMP_VAR_AUTOGEN139__RANDOM = perf_hooks.performance.now();
 await  TEMP_VAR_AUTOGEN139__RANDOM
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/config.server.shallow.spec.ts& [81, 4; 81, 31]& TEMP_VAR_AUTOGEN139__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN139__RANDOM));
  

    
await configServer.stop();
    
expressServerMock.received(1).close();
    
expect(portsConfigStoreMock.configApiUrl).to.eq("");
  })
;

  
it("stop should throw if close fail", async function () 
{
    
var TEMP_VAR_AUTOGEN151__RANDOM =  configServer.start();

expressServerMock
      .listen(Arg.any())
      .returns(Promise.resolve("http://127.0.0.1:2000"));
    
expressServerMock.close().returns(Promise.reject("test"));
    

var TIMING_TEMP_VAR_AUTOGEN151__RANDOM = perf_hooks.performance.now();
 await  TEMP_VAR_AUTOGEN151__RANDOM
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/test/proxy/config.server.shallow.spec.ts& [92, 4; 92, 31]& TEMP_VAR_AUTOGEN151__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN151__RANDOM));
  

    
await expect(configServer.stop()).to.be.rejectedWith("test");
  })
;
})
;
