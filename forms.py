#
import time

from flask import Flask, render_template, request, jsonify
from wtforms import Form, StringField, validators


class MyFlask(Flask):
    """Due to conflict with Angular.js syntax
     we have to alter Jinja default syntax.
    """
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='<%',
        block_end_string='%>',
        variable_start_string='%%%',
        variable_end_string='%%%',
        comment_start_string='<#',
        comment_end_string='#>',
    ))

app = MyFlask(__name__)


@app.route('/', methods=['GET'])
def hello_world():
    return render_template('index.html')


@app.route('/process-form', methods=['POST'])
def process_form():
    form = HeroForm(request.form)
    form.validate()


@app.route('/alias/<alias>')
def get_alias(alias):
    time.sleep(1)
    if alias in ('bear', 'donkey', 'parrot'):
        return jsonify(alias=alias, found=True)
    else:
        return jsonify(alias=alias, found=False)


class HeroForm(Form):
    name = StringField('Superhero Name', [validators.InputRequired()])
    alias = StringField('Superhero Alias', [validators.InputRequired()])


if __name__ == '__main__':
    app.run(debug=True)
