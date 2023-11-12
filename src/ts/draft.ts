const array = ["a", "b", "c", "d"]
let i = 0
const iterator = {
  [Symbol.iterator]: () => ({
    next: () => {
      const result = {
        value: array[i],
        done: i >= array.length,
      }
      i = i >= array.length ? 0 : i + 1
      return result
    },
  }),
}

function* gt() {
  const solution = [1, 2, 3, 4, 2, 3, 1]
  yield solution
}

function* bt() {
  const solution = [1, 2, 3, 4, 2, 3, 1]
  yield solution
}

//console.log(array[Symbol.iterator])

/*for (const letter of gt()) {
    console.log(letter)
}*/

/*type UContrainte = (V: any) => boolean
type BContrainte = (V1: any, V2: any) => boolean

const differentDe: BContrainte = (case1: number, case2: number) => {
    return case1 !== case2
}

const ligne: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1]
const contraintesLigne: BContrainte[] = []
for (let case1 = 0; case1 < ligne.length; case1++) {
    for (let case2 = case1; case2 < ligne.length; case2++) {
        if (case1 !== case2) {
            contraintesLigne.push(() => differentDe(ligne[case1], ligne[case2]))
            //contraintesLigne.push(() => differentDe(ligne[case2], ligne[case1]))
        }
    }
}
console.log(contraintesLigne.length)*/

import {createDomain, createVariable, createConstraint} from "./services/CSP"

const d = createDomain<number>("d", [1, 2, 3, 4, 5, 6, 7, 8, 9])
const v1 = createVariable<number>("v1", {domain: "d"})
const oddValues = createConstraint<number>("oddValues", {
  arity: 1,
  //type: "intension",
  type: "extension",
  variable: "v1",
  //valueConsistency: (v: number) => v % 2 === 0,
  values: [4, 5, 6, 50, 60, 70],
  valuesType: "supports",
})

for (let x = 0; x < 10; x++) {
  v1.set(x)
  console.log(
    `When trying to set v1 to ${x}, v1 become ${v1.isSet() ? "set" : "unset"}, so its value is ${
      v1.value
    }, that is ${
      oddValues.checkConsistency() ? "consistent" : "inconsistent"
    } with the constraint "oddValues"`,
  )
  v1.unset()
}
console.log()

const v2 = createVariable<number>("v2", {domain: "d"})
const different = createConstraint<number>("different", {
  arity: 2,
  //type: "intension",
  type: "extension",
  variables: ["v1", "v2"],
  //valuesConsistency: (v1: number, v2: number) => v1 !== v2,
  tuples: [
    [4, 2],
    [6, 3],
    [10, 10],
  ],
  tuplesType: "conflicts",
})
for (let y = 4; y <= 6; y++) {
  v1.set(y)
  for (let x = 2; x <= 3; x++) {
    v2.set(x)
    console.log(
      `When trying to set v1 to ${y} and v2 to ${x}, v1 become ${
        v1.isSet() ? "set" : "unset"
      } and v2 become ${v2.isSet() ? "set" : "unset"} and their values are [${v1.value},${
        v2.value
      }], that is ${
        different.checkConsistency() ? "consistent" : "unconsistent"
      } with the constraint "different"`,
    )
    v2.unset()
  }
  v1.unset()
}
