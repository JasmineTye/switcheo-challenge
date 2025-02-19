package keeper_test

import (
	"testing"

	"github.com/stretchr/testify/require"

	keepertest "myBlog/testutil/keeper"
	"myBlog/x/myblog/types"
)

func TestGetParams(t *testing.T) {
	k, ctx := keepertest.MyblogKeeper(t)
	params := types.DefaultParams()

	require.NoError(t, k.SetParams(ctx, params))
	require.EqualValues(t, params, k.GetParams(ctx))
}
