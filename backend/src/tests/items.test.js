const fs = require('fs').promises;
const path = require('path');
const { readData, writeData } = require('../utils/data');

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

describe('Data Utilities', () => {
  const mockData = [{ id: 1, name: 'Item A', price: 10 }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('readData should parse JSON from file', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const result = await readData();
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join(__dirname, '../../data/items.json'),
      'utf-8'
    );
    expect(result).toEqual(mockData);
  });

  test('readData should throw if JSON is invalid', async () => {
    fs.readFile.mockResolvedValue('invalid json');

    await expect(readData()).rejects.toThrow();
  });

  test('writeData should write formatted JSON to file', async () => {
    await writeData(mockData);

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(__dirname, '../../data/items.json'),
      JSON.stringify(mockData, null, 2)
    );
  });

  test('writeData should throw on write error', async () => {
    fs.writeFile.mockRejectedValue(new Error('Write failed'));

    await expect(writeData(mockData)).rejects.toThrow('Write failed');
  });
});