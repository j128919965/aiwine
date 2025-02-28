import { createTextToImageWorkflow } from './comfy';

describe('createTextToImageWorkflow', () => {
  it('should correctly replace all template variables', () => {
    const request = {
      mbti: 'ESFP',
      star: '天蝎座',
      emoji: '上个屁班',
      name: '开开心心坐大牢',
      alcohol: 40
    };

    const result = createTextToImageWorkflow(request);
    expect(result["57"]["inputs"]["input_string"]).toBe(request.name);
    expect(result["58"]["inputs"]["input_string"]).toBe(request.mbti);
    expect(result["59"]["inputs"]["input_string"]).toBe(request.star)
    expect(result["60"]["inputs"]["input_string"]).toBe(request.emoji)
    expect(result["61"]["inputs"]["input_string"]).toBe(`${request.alcohol}%`);
  });
});