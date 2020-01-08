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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const command = __importStar(require("@actions/core/lib/command"));
const fs = __importStar(require("fs"));
function importKV2Secrets(client, secrets) {
    return __awaiter(this, void 0, void 0, function* () {
        secrets.forEach(({ path, key, env, file }) => __awaiter(this, void 0, void 0, function* () {
            const url = `/data/${path}`;
            const res = yield client.get(url);
            core.debug('✔ Secret received successfully');
            if (env) {
                const value = res.data.data.data[key];
                // Export secret as environment variable and mask all lines
                value.split('\n').forEach(line => command.issue('add-mask', line));
                core.exportVariable(env, value);
                core.debug(`✔ ${path} => ${env}`);
            }
            if (file) {
                const value = res.data.data.data.file;
                fs.writeFileSync(file, value);
            }
        }));
    });
}
exports.importKV2Secrets = importKV2Secrets;
