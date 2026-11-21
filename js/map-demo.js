/**
 * CarePlus Multispeciality Clinic - Interactive Map & Directions Helper
 * Hubballi, Karnataka Location Simulator
 * GrowthCraft Studio Showcase Implementation
 */

class ClinicMapManager {
  constructor() {
    this.landmarks = [
      { name: "KLE Tech / BVB College Main Gate", distance: "450 meters", time: "2 min walk", icon: "school" },
      { name: "Shirur Park Circle / Bus Stop", distance: "200 meters", time: "1 min walk", icon: "bus" },
      { name: "Hubballi Junction Railway Station", distance: "4.8 km", time: "12 min drive", icon: "train" },
      { name: "KIMS Hospital Corridor, Vidyanagar", distance: "1.2 km", time: "4 min drive", icon: "hospital" },
      { name: "Chennamma Circle (City Center)", distance: "3.5 km", time: "9 min drive", icon: "compass" }
    ];

    this.init();
  }

  init() {
    this.renderLandmarks();
    this.bindButtons();
  }

  renderLandmarks() {
    const container = document.getElementById('clinicLandmarksList');
    if (!container) return;

    container.innerHTML = this.landmarks.map(lm => {
      return `
        <div class="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-colors">
          <div class="flex items-center space-x-2.5">
            <div class="w-7 h-7 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center text-xs">
              📍
            </div>
            <div>
              <span class="text-xs font-semibold text-slate-800 block">${lm.name}</span>
              <span class="text-2xs text-slate-500">${lm.time}</span>
            </div>
          </div>
          <span class="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">${lm.distance}</span>
        </div>
      `;
    }).join('');
  }

  bindButtons() {
    const directionsBtn = document.getElementById('openGoogleMapsBtn');
    if (directionsBtn) {
      directionsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://maps.google.com/?q=Shirur+Park+Vidyanagar+Hubballi+Karnataka', '_blank');
      });
    }

    const emergencyBtn = document.getElementById('emergencyDispatchBtn');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => {
        if (window.showToast) {
          window.showToast('🚨 Demo Emergency Helpline: Connecting to +91 836 298 4499 (Simulated Call)', 'warning');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.clinicMap = new ClinicMapManager();
});
