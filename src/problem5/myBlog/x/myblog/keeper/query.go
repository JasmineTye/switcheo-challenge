package keeper

import (
	"myBlog/x/myblog/types"
)

var _ types.QueryServer = Keeper{}
