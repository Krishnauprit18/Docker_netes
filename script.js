document.addEventListener('DOMContentLoaded', function () {
    const startSimulationButton = document.getElementById('startSimulation');
    const simulationTypeForm = document.getElementById('simulationTypeForm');
    const targetIpInput = document.getElementById('target_ip');
    const targetPortInput = document.getElementById('target_port');
    const advancedSettingsForm = document.getElementById('advancedSettingsForm');
    const simulationResults = document.getElementById('simulationResults');
    const resultsContent = document.getElementById('resultsContent');

    startSimulationButton.addEventListener('click', function () {
        const selectedSimulationTypes = simulationTypeForm.querySelectorAll('input[name="simulation_type"]:checked');
        if (selectedSimulationTypes.length === 0) {
            alert('Please select at least one simulation type.');
            return;
        }

        const targetIp = targetIpInput.value.trim();
        const targetPort = targetPortInput.value.trim();

        if (!isValidIpAddress(targetIp) || !isValidPort(targetPort)) {
            alert('Please enter a valid IP address and port.');
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

        resultsContent.innerHTML = `<p>Selected Simulation Type: ${getSelectedSimulationTypes()}</p>`;

        simulateServerResponse();
    });

    function getSelectedSimulationTypes() {
        const selectedTypes = Array.from(simulationTypeForm.querySelectorAll('input[name="simulation_type"]:checked'))
            .map(checkbox => checkbox.value);
        return selectedTypes.join(', ');
    }

    function simulateServerResponse() {
        setTimeout(() => {
            resultsContent.innerHTML += `
                <p>Attack Successful!</p>
                <p>Details:</p>
                <ul>
                    <li>Credentials Stolen</li>
                    <li>Malware Deployed</li>
                    <li>No. of Requests: 10,000</li>
                </ul>
            `;
            simulationResults.classList.remove('hidden');
        }, 2000); 
    }
});
