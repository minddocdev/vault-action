"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const yaml = __importStar(require("js-yaml"));
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("./auth");
const kv_1 = require("./kv");
const loadYaml = (name, options) => {
    const rawValue = core.getInput(name, options);
    try {
        const value = yaml.safeLoad(rawValue);
        core.debug(`Loaded YAML string: ${value}`);
        return value;
    }
    catch (err) {
        throw new Error(`Expecting YAML string for: ${name}`);
    }
};
const vaultClient = (url, headers) => {
    return axios_1.default.create({
        headers,
        baseURL: url,
    });
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = core.getInput('url', { required: true });
            const token = core.getInput('token', { required: true });
            const secrets = loadYaml('secrets', {
                required: true
            });
            const namespace = core.getInput('namespace', { required: false });
            const authMethod = VaultAction.AuthMethods.github; // TODO - Support other auth methods
            const secretsEngine = loadYaml('secretEngine', { required: false }) || {
                name: VaultAction.SecretsEngines.KV,
                config: {
                    path: '/kv',
                    version: 2,
                },
            };
            if (secretsEngine.name !== VaultAction.SecretsEngines.KV) {
                // TODO - Support other secret engines
                throw new Error(`Unsupported secret engine: ${secretsEngine}`);
            }
            else if (secretsEngine.config.version !== 2) {
                // TODO - Support KV1 secret engine
                throw new Error(`Unsupported KV engine version ${secretsEngine.config.version}`);
            }
            core.debug('Loaded variables:');
            core.debug(`- url: ${url}`);
            core.debug(`- token: ${token}`);
            core.debug(`- secrets: ${secrets}`);
            core.debug(`- namespace: ${namespace}`);
            core.debug(`- auth method: ${authMethod}`);
            core.debug(`- secrets engine: ${secretsEngine}`);
            const headers = {};
            if (namespace != null) {
                headers['X-Vault-Namespace'] = namespace;
            }
            const vaultToken = yield core.group(`Login using ${authMethod}`, () => auth_1.login(vaultClient(`${url}/v1/auth`, headers), authMethod, token));
            headers['X-Vault-Token'] = vaultToken;
            const { path, version } = secretsEngine.config;
            yield core.group(`Retrieve Vault Secrets using ${secretsEngine.name} engine`, () => kv_1.importKV2Secrets(vaultClient(`${url}/v1${path}/${version}`, headers), secrets, vaultToken));
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
