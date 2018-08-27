if [ ! -d ".venv" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
virtualenv -p /usr/bin/python2.7 .venv
.venv/bin/pip install -r requirements.txt
fi

.venv/bin/python app.py


