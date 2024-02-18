from flask import Flask, render_template, request, jsonify
from ddos_dectection import predict_ddos  

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    try:
        # Retrieving our data
        simulation_type = request.form.get('simulation_type')
        target_ip = request.form.get('target_ip')
        target_port = request.form.get('target_port')

        # Performing DDoS prediction using our ML model
        ddos_prediction = predict_ddos(target_ip, target_port)

        return render_template('result.html', prediction=ddos_prediction)

    except Exception as e:
        return render_template('error.html', error=str(e))

if __name__ == '__main__':
    app.run(debug=True)
