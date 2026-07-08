import re

s = '\\\\angle'  # Two backslashes
print("Input:", len(s), list(s))

# Using a standard string lambda
out1 = re.sub(r'\\\\(angle)', lambda m: '\\\\' + m.group(1), s)
print("Lambda '\\\\':", len(out1), list(out1))

# Using a raw string lambda
out2 = re.sub(r'\\\\(angle)', lambda m: r'\\' + m.group(1), s)
print("Lambda r'\\\\':", len(out2), list(out2))
