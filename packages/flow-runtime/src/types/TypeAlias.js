
import Type from './Type';
import type {Constructor, TypeConstraint} from './';

import TypeParameterApplication from './TypeParameterApplication';

export default class TypeAlias extends Type {
  typeName: string = 'TypeAlias';
  name: string;
  type: Type;
  constraints: TypeConstraint[] = [];

  addConstraint (constraint: TypeConstraint): TypeAlias {
    this.constraints.push(constraint);
    return this;
  }

  accepts (input: any): boolean {
    const {constraints, type} = this;
    if (!type.accepts(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input)) {
        return false;
      }
    }
    return true;
  }


  acceptsType (input: Type): boolean {
    return this.type.acceptsType(input);
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  makeErrorMessage (): string {
    return `Invalid value for type: ${this.name}.`;
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    return this.type.resolve();
  }

  toString (withDeclaration?: boolean): string {
    const {name, type} = this;
    if (withDeclaration) {
      return `type ${name} = ${type.toString()};`;
    }
    else {
      return name;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      type: this.type
    };
  }
}