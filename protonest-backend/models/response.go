package models

// ResponseStatus represents the status of API responses
type ResponseStatus string

const (
	StatusSuccess ResponseStatus = "success"
	StatusFail    ResponseStatus = "fail"
	StatusError   ResponseStatus = "error"
)

// APIResponse represents the standard API response structure
type APIResponse struct {
	Status  ResponseStatus `json:"status"`
	Message string         `json:"message,omitempty"`
	Data    interface{}    `json:"data,omitempty"`
	Error   string         `json:"error,omitempty"`
}

// SuccessResponse creates a success response
func SuccessResponse(message string, data interface{}) APIResponse {
	return APIResponse{
		Status:  StatusSuccess,
		Message: message,
		Data:    data,
	}
}

// FailResponse creates a fail response (client error)
func FailResponse(message string) APIResponse {
	return APIResponse{
		Status:  StatusFail,
		Message: message,
	}
}

// ErrorResponse creates an error response (server error)
func ErrorResponse(error string) APIResponse {
	return APIResponse{
		Status: StatusError,
		Error:  error,
	}
}
