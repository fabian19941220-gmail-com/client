// Auto-generated by avdl-compiler v1.3.7 (https://github.com/keybase/node-avdl-compiler)
//   Input file: avdl/keybase1/login_ui.avdl

package keybase1

import (
	rpc "github.com/keybase/go-framed-msgpack-rpc"
	context "golang.org/x/net/context"
)

type GetEmailOrUsernameArg struct {
	SessionID int `codec:"sessionID" json:"sessionID"`
}

type PromptRevokePaperKeysArg struct {
	SessionID int    `codec:"sessionID" json:"sessionID"`
	Device    Device `codec:"device" json:"device"`
	Index     int    `codec:"index" json:"index"`
}

type DisplayPaperKeyPhraseArg struct {
	SessionID int    `codec:"sessionID" json:"sessionID"`
	Phrase    string `codec:"phrase" json:"phrase"`
}

type DisplayPrimaryPaperKeyArg struct {
	SessionID int    `codec:"sessionID" json:"sessionID"`
	Phrase    string `codec:"phrase" json:"phrase"`
}

type LoginUiInterface interface {
	GetEmailOrUsername(context.Context, int) (string, error)
	PromptRevokePaperKeys(context.Context, PromptRevokePaperKeysArg) (bool, error)
	DisplayPaperKeyPhrase(context.Context, DisplayPaperKeyPhraseArg) error
	DisplayPrimaryPaperKey(context.Context, DisplayPrimaryPaperKeyArg) error
}

func LoginUiProtocol(i LoginUiInterface) rpc.Protocol {
	return rpc.Protocol{
		Name: "keybase.1.loginUi",
		Methods: map[string]rpc.ServeHandlerDescription{
			"getEmailOrUsername": {
				MakeArg: func() interface{} {
					ret := make([]GetEmailOrUsernameArg, 1)
					return &ret
				},
				Handler: func(ctx context.Context, args interface{}) (ret interface{}, err error) {
					typedArgs, ok := args.(*[]GetEmailOrUsernameArg)
					if !ok {
						err = rpc.NewTypeError((*[]GetEmailOrUsernameArg)(nil), args)
						return
					}
					ret, err = i.GetEmailOrUsername(ctx, (*typedArgs)[0].SessionID)
					return
				},
				MethodType: rpc.MethodCall,
			},
			"promptRevokePaperKeys": {
				MakeArg: func() interface{} {
					ret := make([]PromptRevokePaperKeysArg, 1)
					return &ret
				},
				Handler: func(ctx context.Context, args interface{}) (ret interface{}, err error) {
					typedArgs, ok := args.(*[]PromptRevokePaperKeysArg)
					if !ok {
						err = rpc.NewTypeError((*[]PromptRevokePaperKeysArg)(nil), args)
						return
					}
					ret, err = i.PromptRevokePaperKeys(ctx, (*typedArgs)[0])
					return
				},
				MethodType: rpc.MethodCall,
			},
			"displayPaperKeyPhrase": {
				MakeArg: func() interface{} {
					ret := make([]DisplayPaperKeyPhraseArg, 1)
					return &ret
				},
				Handler: func(ctx context.Context, args interface{}) (ret interface{}, err error) {
					typedArgs, ok := args.(*[]DisplayPaperKeyPhraseArg)
					if !ok {
						err = rpc.NewTypeError((*[]DisplayPaperKeyPhraseArg)(nil), args)
						return
					}
					err = i.DisplayPaperKeyPhrase(ctx, (*typedArgs)[0])
					return
				},
				MethodType: rpc.MethodCall,
			},
			"displayPrimaryPaperKey": {
				MakeArg: func() interface{} {
					ret := make([]DisplayPrimaryPaperKeyArg, 1)
					return &ret
				},
				Handler: func(ctx context.Context, args interface{}) (ret interface{}, err error) {
					typedArgs, ok := args.(*[]DisplayPrimaryPaperKeyArg)
					if !ok {
						err = rpc.NewTypeError((*[]DisplayPrimaryPaperKeyArg)(nil), args)
						return
					}
					err = i.DisplayPrimaryPaperKey(ctx, (*typedArgs)[0])
					return
				},
				MethodType: rpc.MethodCall,
			},
		},
	}
}

type LoginUiClient struct {
	Cli rpc.GenericClient
}

func (c LoginUiClient) GetEmailOrUsername(ctx context.Context, sessionID int) (res string, err error) {
	__arg := GetEmailOrUsernameArg{SessionID: sessionID}
	err = c.Cli.Call(ctx, "keybase.1.loginUi.getEmailOrUsername", []interface{}{__arg}, &res)
	return
}

func (c LoginUiClient) PromptRevokePaperKeys(ctx context.Context, __arg PromptRevokePaperKeysArg) (res bool, err error) {
	err = c.Cli.Call(ctx, "keybase.1.loginUi.promptRevokePaperKeys", []interface{}{__arg}, &res)
	return
}

func (c LoginUiClient) DisplayPaperKeyPhrase(ctx context.Context, __arg DisplayPaperKeyPhraseArg) (err error) {
	err = c.Cli.Call(ctx, "keybase.1.loginUi.displayPaperKeyPhrase", []interface{}{__arg}, nil)
	return
}

func (c LoginUiClient) DisplayPrimaryPaperKey(ctx context.Context, __arg DisplayPrimaryPaperKeyArg) (err error) {
	err = c.Cli.Call(ctx, "keybase.1.loginUi.displayPrimaryPaperKey", []interface{}{__arg}, nil)
	return
}
