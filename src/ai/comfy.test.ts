import { createTextToImageWorkflow } from './comfy';

describe('createTextToImageWorkflow', () => {
  it('should correctly replace all template variables', () => {
    const request = {
      mbti: 'ESFP',
      zodiac: '天蝎座',
      mood : '上个屁班',
      name: '开开心心坐大牢',
      alcohol: 40
    };

    const result = createTextToImageWorkflow(request);
    console.log(JSON.stringify(result))
    expect(result["57"]["inputs"]["input_string"]).toBe(request.name);
    expect(result["58"]["inputs"]["input_string"]).toBe(request.mbti);
    expect(result["59"]["inputs"]["input_string"]).toBe(request.zodiac)
    expect(result["60"]["inputs"]["input_string"]).toBe(request.mood)
    expect(result["61"]["inputs"]["input_string"]).toBe(`${request.alcohol}%`);
  });
});