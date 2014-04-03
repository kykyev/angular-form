#
import time

from flask import Flask, request, jsonify, abort
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


@app.errorhandler(404)
def page_not_found(err):
    return jsonify(errcode=404), 404


@app.errorhandler(500)
def internal_server_error(err):
    return jsonify(errcode=500), 500


@app.route('/', methods=['GET'])
def hello_world():
    return app.send_static_file('index.html')


@app.route('/api/hero/create', methods=['POST'])
def process_form():
    form = HeroForm(request.form)
    form.validate()


@app.route('/api/hero/find-by-alias/<alias>')
def get_alias(alias):
    time.sleep(0.2)
    if alias == 'evilmonk500':
        abort(500)
    if alias in ('bear', 'donkey', 'parrot'):
        return jsonify(alias=alias, found=True)
    return jsonify(alias=alias, found=False)


class HeroForm(Form):
    name = StringField('Superhero Name', [validators.InputRequired()])
    alias = StringField('Superhero Alias', [validators.InputRequired()])


if __name__ == '__main__':
    app.run(debug=True)
