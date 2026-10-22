package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UploadHandler struct {
	uploadDir string
}

func NewUploadHandler(uploadDir string) *UploadHandler {
	_ = os.MkdirAll(uploadDir, 0755)
	return &UploadHandler{uploadDir: uploadDir}
}

// UploadFile handles image or video uploads for products, journey milestones, or custom request references
func (h *UploadHandler) UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file received: " + err.Error()})
		return
	}

	// Validate file size (max 20MB)
	if file.Size > 20*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File exceeds 20MB limit."})
		return
	}

	// Validate extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	validExts := map[string]bool{
		".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".mp4": true, ".mov": true,
	}
	if !validExts[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Supported types: jpg, jpeg, png, webp, mp4, mov"})
		return
	}

	// Generate safe random filename
	safeFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	dst := filepath.Join(h.uploadDir, safeFilename)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file: " + err.Error()})
		return
	}

	fileURL := fmt.Sprintf("/uploads/%s", safeFilename)
	c.JSON(http.StatusCreated, gin.H{
		"message":  "File uploaded successfully",
		"url":      fileURL,
		"filename": safeFilename,
		"size":     file.Size,
	})
}
