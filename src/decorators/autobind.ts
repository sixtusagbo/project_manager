/**
 * Automatically binds `this` to event handlers.
 *
 * @param _ target
 * @param __ method name
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor} Improved Descriptor
 */
export function autobind(_: any, __: string, descriptor: PropertyDescriptor) {
  let initialMethod = descriptor.value;
  const improvedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundMethod = initialMethod.bind(this);
      return boundMethod;
    },
  };

  return improvedDescriptor;
}
