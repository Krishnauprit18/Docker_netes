document.addEventListener('DOMContentLoaded', function () {
    const simulationForm = document.getElementById('simulationForm');
    const simulationTypeForm = document.getElementById('simulationTypeForm');
    const targetIpInput = document.getElementById('target_ip');
    const targetPortInput = document.getElementById('target_port');
    const advancedSettingsForm = document.getElementById('advancedSettingsForm');

    simulationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Your existing form validation logic
        const selectedSimulationTypes = simulationTypeForm.querySelectorAll('input[name="simulation_type"]:checked');
        if (selectedSimulationTypes.length === 0) {
            alert('Please select at least one simulation type.');
            return;
        }

        const targetIp = targetIpInput.value.trim();
        const targetPort = targetPortInput.value.trim();

        if (!isValidIpAddress(targetIp) || !isValidPort(targetPort)) {
            alert('Please enter a valid IP address.');
            return;
        }

        if (!advancedSettingsForm.querySelector('input[name="ai_simulation"]:checked')) {
            alert('Please select AI-driven Simulation.');
            return;
        }

        // Function to validate IP address format
        function isValidIpAddress(ip) {
            const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
            return ipRegex.test(ip);
        }

        // Function to validate port format
        function isValidPort(port) {
            const portRegex = /^(?!0)([0-9]{1,5})$/;
            return portRegex.test(port);
        }

        // Use AJAX to submit the form data
        fetch(simulationForm.action, {
            method: 'POST',
            body: new FormData(simulationForm),
        })
        .then(response => response.text())
        .then(data => {
            // Update the result or error section based on the response
            document.getElementById('simulationResults').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
