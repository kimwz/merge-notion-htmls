# What is.
A simple script to merge html files exported from Notion into one html file.

### It is recommended in the following cases
- If you want to export the Notion's document as a single file
- If you want to **keep internal links** when merging into a single file


# How to use



```

npm install -g merge-notion-htmls
merge-notion-htmls target.html

```


manually
```

git clone https://github.com/kimwz/merge-notion-htmls
cd merge-notion-htmls
npm install

node ./merge.js target.html

```

Result 
```
load success : target.html
load success : subpage/a.html
load success : subpage/b.html
load success : subpage/c.html
...
exported : out.html

```

# How to convert to pdf
It provides simple but powerful features in the browser.

1. Open a single html file.
2. Open Print Pages. (Ctrl or Cmd + P)
3. Select the type as pdf and print it out. (Even if you do this, the internal link is still alive.)
