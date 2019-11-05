import FixedSizeBuffer from '../../../src/runners/utils/fixedSizeBuffer';

describe('FixedSizeBuffer', () => {
  test('Contains correct elements when not fully filled', () => {
    // Given
    const buffer = FixedSizeBuffer(3);
    buffer.push(2);
    buffer.push(3);
    const expectedElements = [2, 3];

    // When
    const bufferElements = buffer.toArray();

    // Then
    expect(bufferElements).toStrictEqual(expectedElements);
  });

  test('Contains correct elements when over filled', () => {
    // Given
    const buffer = FixedSizeBuffer(3);
    buffer.push(2);
    buffer.push(3);
    buffer.push(4);
    buffer.push(5);
    const expectedElements = [3, 4, 5];

    // When
    const bufferElements = buffer.toArray();

    // Then
    expect(bufferElements).toStrictEqual(expectedElements);
  });
});
