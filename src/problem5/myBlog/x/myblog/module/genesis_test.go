package myblog_test

import (
	"testing"

	keepertest "myBlog/testutil/keeper"
	"myBlog/testutil/nullify"
	myblog "myBlog/x/myblog/module"
	"myBlog/x/myblog/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.MyblogKeeper(t)
	myblog.InitGenesis(ctx, k, genesisState)
	got := myblog.ExportGenesis(ctx, k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
