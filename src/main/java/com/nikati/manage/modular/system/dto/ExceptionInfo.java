package com.nikati.manage.modular.system.dto;

/**
 * @author shanfy
 */
public class ExceptionInfo {

	/**
	 * 状态信息
	 */
	private long errorCode;

    /**
     * 功能：错误消息
     */
    private String errorMessage;


    public ExceptionInfo() {

    }

	public ExceptionInfo(long errorCode, String errorMessage) {
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}

	public long getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(long errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}
