let api = {
	//-------------------------------密度调整------------------------------
	densityAdjustment:`/baseUrl/api/MKDevice/selectMkDensityAction`,//密度调整
	densityAdjustmentWay:`/baseUrl/api/MKDevice/selectAllMkDensityAction`,//密度调整--更多
	//-------------------------------参数设置------------------------------
	parameterSetting:`/baseUrl/api/MKSystem/list`,//参数设置总数据
	setParameterValue:`/baseUrl/api/MKSystem/update`,//参数设置-回车回调
	parameterSettingWay:`/baseUrl/api/MkSystem/listAll`,//参数设置-更多--数据
	//-------------------------------设备状态------------------------------
	currentStatus:`/baseUrl/api/MKDevice/programRunningMode`,//设备状态--当前状态
	setCurrentStatus:`/baseUrl/api/MKDevice/updateRunningMode/`,//设备状态--发送当前状态
	getStatusData:`/baseUrl/api/MKDevice/selectState`,//设备状态--当前状态--数据
	setPattern:`/baseUrl/api/v1/homepage/block/`,//设备状态--发送密控模式
	getPattern:`/baseUrl/api/v1/homepage/block`,//设备状态--获取密控模式
	setFacility:`/baseUrl/api/MKDevice/editDeviceState`,//设备状态--回车发送修改值
	ashAllowed:`/baseUrl/api/v1/homepage/incineration`,//设备状态--化验灰分填报
	//-------------------------------报警信息------------------------------
	homePageAlarmInfo:`/baseUrl/api/MKAlarm/homePageAlarmInfo`,//报警信息
	alarmInformationWay:`/baseUrl/api/MKAlarm/getAlarmInfo`,//报警信息--更多
	alarmPullDown:`/baseUrl/api/MKAlarm/dictionary`,//报警信息--更多--下拉列表
	//-------------------------------曲线------------------------------
	ashEcharts:`/baseUrl/api/v1/curve/hui-fen`,//曲线数据--灰分
	densityEcharts:`/baseUrl/api/v1/curve/mi-du`,//曲线数据--密度
	valveEcharts:`/baseUrl/api/v1/curve/fa-men`,//曲线数据--阀门
	//-------------------------------曲线更多------------------------------
	ashEchartsWay:`/baseUrl/api/v1/curve/more/hui-fen/list`,//曲线数据--灰分
	densityEchartsWay:`/baseUrl/api/v1/curve/more/mi-du/list`,//曲线数据--密度
	valveEchartsWay:`/baseUrl/api/v1/curve/more/fa-men/list`,//曲线数据--阀门
	
	//-------------------------------曲线右侧数据------------------------------
	ashRight:`/baseUrl/api/v1/homepage/hui-fen`,//曲线数据--右侧--灰分
	densityRight:`/baseUrl/api/v1/homepage/mi-du`,//曲线数据--右侧--密度
	moisturizingRight:`/baseUrl/api/v1/homepage/fa-men/45`,//曲线数据--右侧--补水阀
	shuntRight:`/baseUrl/api/v1/homepage/fa-men/56`,//曲线数据--右侧--分流阀
	
	
	
}
export default api
