package types

const (
	// ModuleName defines the module name
	ModuleName = "myblog"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_myblog"

	// PostKey is used to uniquely identify posts within the system
	// will be used as the beginning of the key of each post, followed by their unique id
	PostKey = "Post/value/"

	// This key will be used to keep track of the ID of the latest post added to the store
	PostCountKey = "Post/count"
)

var (
	ParamsKey = []byte("p_myblog")
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
