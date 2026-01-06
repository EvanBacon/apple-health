#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Helper to catch Objective-C exceptions and convert them to NSError.
/// This is necessary because Swift cannot catch NSException directly.
@interface ObjCExceptionHandler : NSObject

/// Executes a block and catches any NSException.
/// @param block The block to execute
/// @return nil if successful, NSError if an exception was thrown
+ (nullable NSError *)executeAndCatchException:(void (NS_NOESCAPE ^)(void))block;

@end

NS_ASSUME_NONNULL_END
