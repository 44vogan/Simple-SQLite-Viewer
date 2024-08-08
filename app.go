package main

import (
	"context"
	"fmt"

	"database/sql"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	_ "modernc.org/sqlite" // Import the sqlite driver
)

// App struct
type App struct {
	ctx context.Context
}
type Columns struct {
	Name     string `json:"name"`
	DataType string `json:"dataType"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	runtime.LogInfo(a.ctx, "App started")
	// runtime.WindowMaximise(a.ctx)
}

type ExecQueryResponse struct {
	Result []map[string]interface{} `json:"result"`
	Status string                   `json:"status"`
}

func (a *App) ExecQuery(dbPath, query string) ExecQueryResponse {
	db, err := connectToDb(dbPath)
	if err != nil {
		runtime.LogError(a.ctx, "Error connecting to database")
		return ExecQueryResponse{Result: nil, Status: "Error connecting to database"}
	}
	res, err := dbQuery(db, query)
	if err != nil {
		runtime.LogError(a.ctx, "Error executing query")
		return ExecQueryResponse{Result: res, Status: "Error executing query"}
	}
	return ExecQueryResponse{Result: res, Status: "ok"}
}

func (a *App) ShowWrongFileTypeMessage() {
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    runtime.InfoDialog,
		Title:   "Wrong File Type",
		Message: " Only .db Files Are Supported",
	})
}

type OpenFileResponse struct {
	Path   string `json:"path"`
	Status string `json:"status"`
}

func (a *App) OpenFile() OpenFileResponse {

	filePath, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Filters: []runtime.FileFilter{
			{
				DisplayName: "SQLite Database (*.db)",
				Pattern:     "*.db",
			},
		},
	})

	if err != nil {
		return OpenFileResponse{Path: "", Status: err.Error()}
	}

	return OpenFileResponse{Path: filePath, Status: "ok"}
}

type DbTablesResponse struct {
	Tables []string `json:"tables"`
	Status string   `json:"status"`
}

func (a *App) GetTableNames(dbPath string) DbTablesResponse {
	db, err := connectToDb(dbPath)
	if err != nil {
		return DbTablesResponse{Tables: []string{}, Status: "Error connecting to database"}
	}

	tables, err := getTables(db)
	if err != nil {
		return DbTablesResponse{Tables: []string{}, Status: "Error getting tables"}
	}
	return DbTablesResponse{Tables: tables, Status: "ok"}
}

// TableInfo represents the structure to hold table information
type TableInfo struct {
	Columns []Columns `json:"columns"`
	Status  string    `json:"status"`
}

func (a *App) GetTableInfo(dbPath string, tableName string) TableInfo {
	db, err := connectToDb(dbPath)
	if err != nil {
		return TableInfo{Columns: []Columns{}, Status: "Error connecting to database"}
	}

	columns, err := readTableInfo(db, tableName)
	if err != nil {
		return TableInfo{Columns: []Columns{}, Status: "Error reading table info"}
	}
	return TableInfo{Columns: columns, Status: "ok"}
}

type GetTableDataResponse struct {
	Data   []map[string]interface{} `json:"data"`
	Status string                   `json:"status"`
}

func (a *App) GetTableData(dbPath string, tableName string, limit int) GetTableDataResponse {
	db, err := connectToDb(dbPath)
	if err != nil {
		return GetTableDataResponse{Data: nil, Status: "Error connecting to database"}
	}

	data, err := readTableData(db, tableName, limit)
	if err != nil {
		return GetTableDataResponse{Data: nil, Status: "Error reading table data"}
	}
	return GetTableDataResponse{Data: data, Status: "ok"}
}

func connectToDb(filepath string) (*sql.DB, error) { // Connect to the SQLite database
	db, err := sql.Open("sqlite", filepath)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func getTables(db *sql.DB) ([]string, error) {
	query := `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tableNames []string
	for rows.Next() {
		var tableName string
		err := rows.Scan(&tableName)
		if err != nil {
			return nil, err
		}
		tableNames = append(tableNames, tableName)
	}
	return tableNames, nil
}

func readTableInfo(db *sql.DB, tableName string) ([]Columns, error) { // Get column names and data types
	query := `SELECT name, type FROM pragma_table_info(?)`
	rows, err := db.Query(query, tableName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var columns []Columns
	for rows.Next() {
		var name string
		var dataType string
		err := rows.Scan(&name, &dataType)
		if err != nil {
			return nil, err
		}
		columns = append(columns, Columns{Name: name, DataType: dataType})
	}

	return columns, nil
}

func readTableData(db *sql.DB, tableName string, limit int) ([]map[string]interface{}, error) { // Get table data
	query := fmt.Sprintf("SELECT * FROM %s LIMIT %d", tableName, limit)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Get column names dynamically
	columnNames, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	// Create a slice of maps to store data
	var data []map[string]interface{}
	for rows.Next() {
		scanValues := make([]interface{}, len(columnNames))
		for i := range scanValues {
			scanValues[i] = new(interface{})
		}
		err := rows.Scan(scanValues...)
		if err != nil {
			return nil, err
		}

		// Convert scanValues to map
		rowData := make(map[string]interface{})
		for i := range columnNames {
			rowData[columnNames[i]] = scanValues[i]
		}
		data = append(data, rowData)
	}

	return data, nil
}

// ExecQuery executes a query and returns the result
func dbQuery(db *sql.DB, query string) ([]map[string]interface{}, error) {
	rows, err := db.Query(query)
	if err != nil {
		// handle error
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		// handle error
		return nil, err
	}

	var result []map[string]interface{}

	for rows.Next() {
		values := make([]interface{}, len(columns))
		valuePtrs := make([]interface{}, len(columns))
		for i := range values {
			valuePtrs[i] = &values[i]
		}

		err := rows.Scan(valuePtrs...)
		if err != nil {
			// handle error
			return nil, err
		}

		row := make(map[string]interface{})
		for i, col := range columns {
			row[col] = values[i]
		}

		result = append(result, row)
	}

	if err := rows.Err(); err != nil {
		// handle error
		return nil, err
	}

	return result, nil
}
