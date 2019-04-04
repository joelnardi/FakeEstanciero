package terrateniente.utils;

public class Timer {

	private float elapsed;
	private float target;
	private boolean finished;
	private float updateInterval;
	public ITimer timerlistener;
	
	public Timer(float setTime){
		this.elapsed = 0;
		this.finished = true;
		this.updateInterval = setTime;
		this.timerlistener = new ITimer() {
			
			@Override
			public void onRestart() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onInterval() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onInit() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onEnd() {
				// TODO Auto-generated method stub
				
			}
		};
	}

	public int getTime() {
		return (int) (this.target/1000);
	}
	
	public void update(float dt) {
		if(this.finished) return;
		this.elapsed += dt;
		if(this.elapsed >= updateInterval) {
			//this.finished = true;
			this.elapsed = 0;
			this.target -= updateInterval;
			this.timerlistener.onInterval();
		}
		if(this.target <= 0) {
			this.finished = true;
			this.timerlistener.onEnd();
		}
	}
	
	public void restart() {
		this.finished = false;
		this.elapsed = 0;
		this.timerlistener.onRestart();
	}

	public void set(float t) {
		this.timerlistener.onInit();
		this.target = t;
		this.finished = false;
		this.elapsed = 0;
	}
}
