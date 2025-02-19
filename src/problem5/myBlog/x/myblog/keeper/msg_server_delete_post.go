package keeper

import (
	"context"
	"fmt"

	"myBlog/x/myblog/types"

	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

func (k msgServer) DeletePost(goCtx context.Context, msg *types.MsgDeletePost) (*types.MsgDeletePostResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetPost(ctx, msg.Id)
	if !found {
		return nil, errorsmod.Wrap(sdkerrors.ErrKeyNotFound, fmt.Sprintf("key %d does not exist", msg.Id))
	}

	// check if creator of the incoming message is the same
	if msg.Creator != val.Creator {
		// return unauthorised error
		return nil, errorsmod.Wrap(sdkerrors.ErrUnauthorized, "Incorrect owner!")
	}

	k.RemovePost(ctx, msg.Id)

	return &types.MsgDeletePostResponse{}, nil
}
