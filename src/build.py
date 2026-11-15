h=open('head.html').read()
s=open('script2.html').read().replace('//__SPRITES__',open('sprites.js').read())
open('skimmer.html','w').write(h+s)
