import re
s = '\\\\angle'  # Two backslashes
print("Input:", len(s), list(s))
out = re.sub(r'\\\\(angle)', lambda m: '\\' + m.group(1), s)
print("Output:", len(out), list(out))
