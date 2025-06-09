import Options, { OptionsJacobian, OptionsLinearSolver, OptionsPreconditioner } from '../src/options';
import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { compileModel } from '../src/index';
import { code1 } from './logistic';

let model: any;

describe('Options', function () {
  before(function () {
    return compileModel(code1).then((m) => {
      model = m;
    });
  });

  it('can construct and destroy', function () {
    let options = new Options(model.optionsFunctions, model.stderr, model.stdout, {});
    options.destroy();
  });

  it('can set and get linear_solver', function () {
    let options = new Options(model.optionsFunctions, model.stderr, model.stdout, { linear_solver: 1 });
    assert.equal(options.get_linear_solver(), 1);
    options.destroy();

    options = new Options(model.optionsFunctions, model.stderr, model.stdout, { linear_solver: OptionsLinearSolver.LINEAR_SOLVER_KLU });
    assert.equal(options.get_linear_solver(), OptionsLinearSolver.LINEAR_SOLVER_KLU );
    options.destroy();
  });
});