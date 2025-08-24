import pytesseract
from PIL import Image

def ocr_image(path):
    try:
        img = Image.open(path).convert('RGB')
        text = pytesseract.image_to_string(img, lang='eng')
        return text
    except Exception as e:
        print('ocr_image error', e)
        return ''
