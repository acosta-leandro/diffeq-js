import Vector from '../src/vector';
import Solver from '../src/solver';
import Options from '../src/options';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileModel } from '../src/index';
import { code1, code2 } from './logistic';

describe('Solver 3 - Multiple Compilations', function () {
  let model1: any;
  let model2: any;

  it('can compile and solve code1', async function () {
    model1 = await compileModel(code1);
    let options = new Options(model1.optionsFunctions, model1.stderr, model1.stdout, {});
    let solver = new Solver(model1.solverFunctions, options, model1.vectorFunctions);
    let times = new Vector([0, 2], model1.vectorFunctions);
    let inputs = new Vector([1, 2], model1.vectorFunctions);
    let outputs = new Vector(new Array(times.length() * solver.number_of_outputs), model1.vectorFunctions);
    
    solver.solve(times, inputs, outputs);
    
    const outputArray = outputs.getFloat64Array();
    const sum = outputArray.reduce((acc, curr) => acc + curr, 0);
    const expectedSum = 167.28648630426795;
    
    assert.approximately(sum, expectedSum, 0.0001);
    
    solver.destroy();
  });

  it('can compile code2 and solve both code1 and code2', async function () {
    model2 = await compileModel(code2);
    
    // Solve code1
    let options1 = new Options(model1.optionsFunctions, model1.stderr, model1.stdout, {});
    let solver1 = new Solver(model1.solverFunctions, options1, model1.vectorFunctions);
    let times1 = new Vector([0, 2], model1.vectorFunctions);
    let inputs1 = new Vector([1, 2], model1.vectorFunctions);
    let outputs1 = new Vector(new Array(times1.length() * solver1.number_of_outputs), model1.vectorFunctions);
    
    solver1.solve(times1, inputs1, outputs1);
    
    const outputArray1 = outputs1.getFloat64Array();
    const sum1 = outputArray1.reduce((acc, curr) => acc + curr, 0);
    const expectedSum1 = 167.28648630426795;
    
    assert.approximately(sum1, expectedSum1, 0.0001);
    
    solver1.destroy();

    // Solve code2
    let options2 = new Options(model2.optionsFunctions, model2.stderr, model2.stdout, {});
    let solver2 = new Solver(model2.solverFunctions, options2, model2.vectorFunctions);
    let times2 = new Vector([0, 2], model2.vectorFunctions);
    let inputs2 = new Vector([1, 2], model2.vectorFunctions);
    let outputs2 = new Vector(new Array(times2.length() * solver2.number_of_outputs), model2.vectorFunctions);
    
    solver2.solve(times2, inputs2, outputs2);
    
    const outputArray2 = outputs2.getFloat64Array();
    const sum2 = outputArray2.reduce((acc, curr) => acc + curr, 0);
    const expectedSum2 = 45.98250398335723;
    
    assert.approximately(sum2, expectedSum2, 0.0001);
    
    solver2.destroy();
  });

  it('can recompile code1 and solve both code1 and code2', async function () {
    model1 = await compileModel(code1);
    model2 = await compileModel(code2);
    
    // Solve code1
    let options1 = new Options(model1.optionsFunctions, model1.stderr, model1.stdout, {});
    let solver1 = new Solver(model1.solverFunctions, options1, model1.vectorFunctions);
    let times1 = new Vector([0, 2], model1.vectorFunctions);
    let inputs1 = new Vector([1, 2], model1.vectorFunctions);
    let outputs1 = new Vector(new Array(times1.length() * solver1.number_of_outputs), model1.vectorFunctions);
    
    solver1.solve(times1, inputs1, outputs1);
    
    const outputArray1 = outputs1.getFloat64Array();
    const sum1 = outputArray1.reduce((acc, curr) => acc + curr, 0);
    const expectedSum1 = 167.28648630426795;
    
    assert.approximately(sum1, expectedSum1, 0.0001);
    
    solver1.destroy();

    // Solve code2
    let options2 = new Options(model2.optionsFunctions, model2.stderr, model2.stdout, {});
    let solver2 = new Solver(model2.solverFunctions, options2, model2.vectorFunctions);
    let times2 = new Vector([0, 2], model2.vectorFunctions);
    let inputs2 = new Vector([1, 2], model2.vectorFunctions);
    let outputs2 = new Vector(new Array(times2.length() * solver2.number_of_outputs), model2.vectorFunctions);
    
    solver2.solve(times2, inputs2, outputs2);
    
    const outputArray2 = outputs2.getFloat64Array();
    const sum2 = outputArray2.reduce((acc, curr) => acc + curr, 0);
    const expectedSum2 = 45.98250398335723;
    
    assert.approximately(sum2, expectedSum2, 0.0001);
    
    solver2.destroy();
  });
}); 