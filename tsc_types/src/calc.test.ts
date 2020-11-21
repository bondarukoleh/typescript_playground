import {runAsync, sum} from './calc'

test('Check result value', () => {
  const operandA = 1;
  const operandB = 1;
  const expectedRes = 2;
  const res = sum(operandA, operandB);
  expect(res).toBe(expectedRes)
})