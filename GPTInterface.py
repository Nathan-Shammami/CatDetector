from transformers import GPTJForCausalLM, GPT2Tokenizer
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the pre-trained GPT-J model and tokenizer
tokenizer = GPT2Tokenizer.from_pretrained('EleutherAI/gpt-j-6B')
model = GPTJForCausalLM.from_pretrained('EleutherAI/gpt-j-6B')


# Route flask through correct URL
@app.route('/generate', methods=['POST'])


def Prompt():
    data = request.json
    input_text = data.get('prompt', '')
    input_ids = tokenizer.encode(input_text, return_tensors='pt')
    output = model.generate(input_ids, 
                            early_stopping=True, 
                            max_length = 50,
                            min_length = 20,
                            repetition_penalty=1.2,
                            temperature=0.7,
                            pad_token_id = tokenizer.generation_config.eos_token_id
                            )
    response_text = tokenizer.decode(output[0], skip_special_tokens=True, clean_up_tokenization_spaces=False)
    response_text = response_text.split('.')[0] + '.'
    return jsonify({'text': response_text})

if __name__ == '__main__':
    app.run(port=5000)