# for i in {1..1000}; do touch "app$i.js"; done  // create 100 files together


for i in {1..1000}; do rm "app$i.js"; done  # delete 100 files altogether
