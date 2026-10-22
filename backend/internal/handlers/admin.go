package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type AdminHandler struct {
	store *storage.Store
}

func NewAdminHandler(store *storage.Store) *AdminHandler {
	return &AdminHandler{store: store}
}

// GetMetrics returns platform-wide operational and financial statistics
func (h *AdminHandler) GetMetrics(c *gin.Context) {
	metrics := h.store.GetAdminMetrics()
	c.JSON(http.StatusOK, gin.H{"metrics": metrics})
}

// GetAuditLogs returns the admin audit log history
func (h *AdminHandler) GetAuditLogs(c *gin.Context) {
	logs := h.store.GetAuditLogs()
	c.JSON(http.StatusOK, gin.H{
		"logs":  logs,
		"count": len(logs),
	})
}

// GetPendingPassports returns passports awaiting independent provenance review
func (h *AdminHandler) GetPendingPassports(c *gin.Context) {
	var pending []*models.CraftPassport
	for _, p := range h.store.Passports {
		if p.ProvenanceStatus == models.ProvenanceArtisanDeclared {
			pending = append(pending, p)
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"passports": pending,
		"count":     len(pending),
	})
}

// GetUsers returns list of registered users and artisans
func (h *AdminHandler) GetUsers(c *gin.Context) {
	var users []*models.User
	for _, u := range h.store.Users {
		users = append(users, u)
	}
	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"count": len(users),
	})
}
