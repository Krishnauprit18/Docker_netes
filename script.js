document.addEventListener("DOMContentLoaded", function() {
    const simulationForm = document.getElementById("simulationForm");
    const simulationResults = document.getElementById("simulationResults");

    simulationForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const targetIp = document.getElementById("target_ip").value.trim();
        const numberOfAttacks = parseInt(document.getElementById("target_port").value.trim());
        const simulationTypes = document.querySelectorAll('input[name="simulation_type"]:checked');
        const aiSimulation = document.querySelector('input[name="ai_simulation"]:checked');

        // checking if target IP or number of attacks is empty
        if (targetIp === '' || isNaN(numberOfAttacks)) {
            alert("Please provide both target IP and number of attacks.");
            return;
        }

        // checking if the target IP is a valid IP address format
        if (!isValidIpAddress(targetIp)) {
            alert("Please provide a valid IP address for the target.");
            return;
        }

        // Check if no simulation type is selected
        if (simulationTypes.length === 0) {
            alert("Please select at least one simulation type.");
            return;
        }

        const credentialsStolen = document.getElementById("credentialsStolen");
        const selectedSimulationTypes = document.getElementById("selectedSimulationTypes");
        const numberOfRequests = document.getElementById("numberOfRequests");

        selectedSimulationTypes.textContent = "Selected Simulation Types: " + Array.from(simulationTypes).map(type => type.value.charAt(0).toUpperCase() + type.value.slice(1).replace('_', ' ')).join(", ");
        if (aiSimulation) {
            selectedSimulationTypes.textContent += ", AI-driven Breach Attack Simulator";
        }

        // Determine if credentials are stolen based on the number of attacks
        if (numberOfAttacks < 150) {
            credentialsStolen.textContent = "Credentials Not Stolen";
        } else {
            credentialsStolen.textContent = "Credentials Stolen";
        }

        numberOfRequests.textContent = "No. of Attacks: " + numberOfAttacks;

        simulationResults.classList.remove("hidden");
    });
});

function isValidIpAddress(ipAddress) {
    const ipPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipPattern.test(ipAddress);
}
