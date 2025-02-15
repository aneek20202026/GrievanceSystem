import gc 
import torch
import spacy
from transformers import T5ForConditionalGeneration, T5Tokenizer, MarianTokenizer, MarianMTModel

urgency_model = T5ForConditionalGeneration.from_pretrained("./urgency_model_v1")
urgency_tokenizer = T5Tokenizer.from_pretrained("./urgency_model_v1")
urgency_model.to("cpu")
urgency_model.eval()

translation_model = MarianMTModel.from_pretrained("./bn-en-translator")
translation_tokenizer = MarianTokenizer.from_pretrained("./bn-en-translator")
translation_model.to("cpu")
translation_model.eval()

category_classifier = spacy.load("./category_classification_en_model_v3")


def get_keywords(grievance):
    doc = category_classifier(grievance)
    keywords = [ent.label_ for ent in doc.ents]

    print("Keywords are: ", [(ent.text, ent.label_) for ent in doc.ents])
    del doc
    gc.collect()
    return keywords

def predict_urgency(grievance, keywords):
    input_text = f"Grievance: {grievance} Keywords: {keywords}"
    inputs = urgency_tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)

    with torch.no_grad():
        output = urgency_model.generate(**inputs, max_length=5)
    
    urgency = urgency_tokenizer.decode(output[0], skip_special_tokens=True)
    print(f"{urgency}%")
    del input_text, inputs, output
    gc.collect()

    return float(urgency)

def custom_translator(text, source_lang, target_lang):
    input_text = f"Translate the provided text from {source_lang} to {target_lang}:\n{text}"

    inputs = translation_tokenizer(input_text, return_tensors="pt",max_length=512, padding=True, truncation=True)
    outputs = translation_model.generate(**inputs, max_length=512, num_beams=5)

    op_text=translation_tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("Translated text: ",op_text)
    del input_text, inputs, outputs
    gc.collect()
    return op_text
