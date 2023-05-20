import openai
import sys

openai.api_key = ''
text = sys.argv[1]
response = openai.Embedding.create(
            input = text,
            model = 'text-embedding-ada-002',
            max_tokens=512,
    )
embeddings = response['data'][0]['embedding']
sys.stdout.write(str(embeddings))