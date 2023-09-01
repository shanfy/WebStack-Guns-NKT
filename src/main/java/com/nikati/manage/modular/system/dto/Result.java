package com.nikati.manage.modular.system.dto;

import java.io.Serializable;
import java.util.function.Supplier;

/**
 * 封装返回对象
 * @author shanfy
 */
public class Result<T> implements Serializable {

    /**
     * 功能：是否成功
     */
    private boolean status;

    /**
     * 功能：返回码
     */
    private long code;

	/**
	 * 功能：返回消息
	 */
	private String message;

    /**
     * 功能：数据对象
     */
    private T data;


    public Result() {
        this.status = false;
    }

    /**
     * 功能：通过设置成功标识
     */
    public Result(boolean status) {
        this.status = status;

    }

    /**
     * 功能：通过成功标志和数据对象来构造结果
     */

    public Result(boolean status, T data) {
        this.status = status;
        this.data = data;
    }


    /**
     * 功能：通过成功标识返回的数据结果 和异常信息来构造对象
     */
    public Result(boolean status, T data, long code, String message) {
        this.status = status;
        this.data = data;
        this.code = code;
        this.message = message;
    }


    /**
     * 功能：设置错误信息
     */
    public Result(boolean status, T data, ExceptionInfo info) {
        this.status = status;
        this.data = data;
	    this.code = info.getErrorCode();
        this.message = info.getErrorMessage();
    }

	/**
	 * 构造方法
	 */
	public Result(boolean status, ExceptionInfo info) {
		this.status = status;
		this.code = info.getErrorCode();
		this.message = info.getErrorMessage();
	}

	/**
	 * 构造方法
	 */
	public Result(boolean status, long code, String message) {
		this.status = status;
		this.code = code;
		this.message = message;
	}

	/**
	 * 功能：直接定义异常
	 */
	public void setException(ExceptionInfo info) {
		this.code = info.getErrorCode();
		this.message = info.getErrorMessage();
	}


	/**
	 * 功能：设置异常信息
	 */
	public ExceptionInfo exceptionInfo() {
		return new ExceptionInfo(this.getCode(), this.getMessage());
	}


	/**
	 * 功能：返回success Result
	 */
	public static <R>  Result<R> successData(R data) {
		return new Result<>(true, data, CodeEnum.SUCCESS.getCode(), CodeEnum.SUCCESS.getMessage());
	}

	/**
	 * 能：返回 Result
	 */
	public static <R>  Result<R> successSupplierData(Supplier<R> supplier) {
		return new Result<>(true, supplier.get(), CodeEnum.SUCCESS.getCode(), CodeEnum.SUCCESS.getMessage());
	}


	/**
	 * 能：返回空的 Result
	 */
	public static <R>  Result<R> successNullData() {
		return new Result<>(true, null, CodeEnum.SUCCESS.getCode(), CodeEnum.SUCCESS.getMessage());
	}
	/**
	 * 功能：返回failure Result
	 */
	public static <R>  Result<R> failureData(ExceptionInfo exceptionInfo) {
		return new Result<>(false, null, exceptionInfo.getErrorCode(), exceptionInfo.getErrorMessage());
	}

	/**
	 * 功能：返回failure Result
	 */
	public static <R>  Result<R> failureData(Throwable throwable) {
		return new Result<>(false, null, CodeEnum.FAILURE.getCode(), throwable.getMessage());
	}

	/**
	 * 功能：返回failure Result
	 */
	public static <R>  Result<R> failureData(String errMsg) {
		return new Result<>(false, null, CodeEnum.FAILURE.getCode(), errMsg);
	}

	/**
	 * 重写toString方法
	 */
	@Override
	public String toString() {
		return "Result{" +
				"status=" + status +
				", code=" + code +
				", message='" + message + '\'' +
				", data=" + data +
				'}';
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public long getCode() {
		return code;
	}

	public void setCode(long code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}
}
