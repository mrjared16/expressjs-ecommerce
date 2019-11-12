for f in SP*.jpg; do
  [[ -f "$f" ]] || continue # skip if not regular file
  dir="${f:2:3}"
  echo "$dir"
  mkdir "$dir"
  mv "$f" "${dir}/1.jpg"
done
