import sys
import json

def demo(text):
    return f"Hello {text}"

if __name__ == "__main__":
    text = sys.argv[1]
    result = {"message": demo(text)}
    print(json.dumps(result))
    # Explicitly exit the script
    sys.exit()