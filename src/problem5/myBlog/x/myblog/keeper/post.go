package keeper

import (
	"encoding/binary"
	"myBlog/x/myblog/types"

	"cosmossdk.io/store/prefix"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

/*
Parameters:
Context (ctx): provides the current blockchain execution context, allowing interactions with the store
runtime.KVStoreAdapter: Opens a key-value store for interacting with the database in the blockchain
prefix.NewStore: Adds a prefix (PostKey) to ensure namespacing, avoid conflicts with the other types
k.cdc.MustMarshal: Serialise the post into bytes, preparing it for storage
store.Set: saves the post data into the store using the post ID as the key
*/

// AppendPost Function
/*
1. Get the current post count
2. Assign an ID to the new post  (ID = current count)
3. Serialise and store the post using the post ID as the key
4. Update the post count and return the new post ID
*/
func (k Keeper) AppendPost(ctx sdk.Context, post types.Post) uint64 {
	// Get the current post count
	count := k.GetPostCount(ctx)

	// Set post ID to current count
	post.Id = count

	// open the key-value store in the context of the blockchain
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))

	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PostKey))

	// serialize the post into bytes for storage
	appendedValue := k.cdc.MustMarshal((&post))

	// store the post in the key-value store, using the post ID as the key
	store.Set(GetPostIDBytes(post.Id), appendedValue)

	// Auto-Increment ID and set the new post count in the store
	k.SetPostCount(ctx, count+1)

	// return ID of newly added post
	return count
}

// GetPostCount: Retrieves the total number of posts in the store
/*
1. Access the key value stored
2. Retrieve the post count from a predefined key. If no count exists, return 0
3. Convert the count from byte array to an unsigned 64-bit integer
*/

func (k Keeper) GetPostCount(ctx sdk.Context) uint64 {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))

	store := prefix.NewStore(storeAdapter, []byte{})

	// define the key for storing the post count
	byteKey := types.KeyPrefix(types.PostCountKey)

	// retrieve the byte value stored under the post count key
	bz := store.Get(byteKey)

	if bz == nil {
		return 0
	}

	// convert the byte value into an unsigned 64-bit integer
	return uint64(binary.BigEndian.Uint64(bz))
}

// GetPostIDBytes : converts a post ID (unsigned 64-bit int ) into a bite slice for use as key
/*
1. Create a byte array
2. Encode the ID as big-endian and return the byte array
*/

func GetPostIDBytes(id uint64) []byte {
	// create an 8-bit array for the ID
	bz := make([]byte, 8)

	// convert the ID to a byte array in big-endian format
	binary.BigEndian.PutUint64(bz, id)

	return bz
}

// SetPostCount function: Stores the updated post count in the key-value store
/*
1. Convert the post count to bytes and store it under PostCountKey
*/

func (k Keeper) SetPostCount(ctx sdk.Context, count uint64) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))

	store := prefix.NewStore(storeAdapter, []byte{})

	byteKey := types.KeyPrefix(types.PostCountKey)

	bz := make([]byte, 8)

	binary.BigEndian.PutUint64(bz, count)

	store.Set(byteKey, bz)
}

// GetPost: Retrieves a post by its ID
/*
1. Access the store and fetch the post by its ID
2. If the post exists, unmarshal it back into the Post object
*/
func (k Keeper) GetPost(ctx sdk.Context, id uint64) (val types.Post, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))

	// create a new store with the post prefix
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PostKey))

	// retrieve the byte value associated with the post ID
	b := store.Get(GetPostIDBytes(id))

	// if post is not found, return false
	if b == nil {
		return val, false
	}

	// unmarshal the byte value back into a Post object
	k.cdc.MustUnmarshal(b, &val)

	return val, true
}

// SetPost: update logic
func (k Keeper) SetPost(ctx sdk.Context, post types.Post) {
	// open the key-value store in the context of the blockchain
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))

	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PostKey))

	// marshal serialise the post object into a byte array so it can be stored
	b := k.cdc.MustMarshal(&post)

	// use post ID as key and store the marshaled post in the store
	store.Set(GetPostIDBytes(post.Id), b)
}

// RemovePost: delete logic
func (k Keeper) RemovePost(ctx sdk.Context, id uint64 ){
	// open the key-value store in the context of the blockchain
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))

	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PostKey))

	store.Delete(GetPostIDBytes(id))
}