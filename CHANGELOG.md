# Changelog

## [1.1.0] - 2026-09-20

### Changed

- Expose NativeHost, ChildrenElement, ContainsElement, and ContainsTarget types for native host refs, legacy native tag trees, and DOM or plain child collections.
- NativeElement no longer inherits DOM Element. Its native fields are readonly and its child collection is optional.
- Containment overloads require compatible container and target types. Numeric native tags are accepted as targets, not containers.
