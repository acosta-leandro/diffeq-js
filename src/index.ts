import { WASI, File, OpenFile, PreopenDirectory } from "@bjorn3/browser_wasi_shim";
import { extract_vector_functions } from "./vector";
import { extract_options_functions } from "./options";
import { extract_solver_functions } from "./solver";
import base from "/node_modules/base-x/src/index";

export { default as Vector } from "./vector";
export { default as Options, OptionsJacobian, OptionsLinearSolver, OptionsPreconditioner } from "./options";
export { default as Solver } from "./solver";

class SimpleOpenFile {
  file: File;
  file_pos: number;
  constructor(file: File) {
    this.file = file;
    this.file_pos = 0;
  }
  readToString() {
    const data = this.file.data as Uint8Array
    const start = this.file_pos;
    const end = data.byteLength;
    const slice = data.slice(start, end);
    this.file_pos = end;
    const string = new TextDecoder().decode(slice);
    return string;
  }
}

const defaultBaseUrl = "https://compbio.fhs.um.edu.mo/diffeq";

function createWasi() {
  let args: string[] = [];
  let env: string[] = [];
  let fds = [
    new OpenFile(new File([])), // stdin
    new OpenFile(new File([])), // stdout
    new OpenFile(new File([])), // stderr
  ];
  return new WASI(args, env, fds);
}

function compileModel(text: string, baseUrl: string = defaultBaseUrl) {
  const data = {
    text,
    name: "unknown",
  };
  const options: RequestInit = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = fetch(`${baseUrl}/compile`, options).then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        throw text;
      });
    }
    return response;
  });
  return compileResponse(response);
}

function compileResponse(response: Promise<Response>) {
  const wasi = createWasi();
  const importObject = {
    "wasi_snapshot_preview1": wasi.wasiImport,
  };
  return WebAssembly.instantiateStreaming(response, importObject).then(
    (obj) => { 
      wasi.initialize(obj.instance);
      const stderr = new SimpleOpenFile(wasi.fds[2].file);
      const stdout = new SimpleOpenFile(wasi.fds[1].file);
      const vectorFunctions = extract_vector_functions(obj);
      const optionsFunctions = extract_options_functions(obj);
      const solverFunctions = extract_solver_functions(obj);
      return {
        instance: obj,
        stderr,
        stdout,
        vectorFunctions,
        optionsFunctions,
        solverFunctions
      };
    },
  );
}

export { compileModel, compileResponse }







