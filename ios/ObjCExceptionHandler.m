#import "ObjCExceptionHandler.h"

@implementation ObjCExceptionHandler

+ (nullable NSError *)executeAndCatchException:(void (NS_NOESCAPE ^)(void))block {
    @try {
        block();
        return nil;
    } @catch (NSException *exception) {
        NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
        userInfo[NSLocalizedDescriptionKey] = exception.reason ?: exception.name;
        userInfo[@"ExceptionName"] = exception.name;
        if (exception.reason) {
            userInfo[@"ExceptionReason"] = exception.reason;
        }
        if (exception.userInfo) {
            userInfo[@"ExceptionUserInfo"] = exception.userInfo;
        }
        return [NSError errorWithDomain:@"HealthKitException"
                                   code:-1
                               userInfo:userInfo];
    }
}

@end
