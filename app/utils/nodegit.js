import nodegit from 'nodegit'

export default nodegit

export function getBranches(path) {
  return nodegit.Repository.open(path)
    .then((repo) => {
      return repo.getReferenceNames(nodegit.Reference.TYPE.LISTALL)
    })
}

export function getPrefixedBranches(path, prefix) {
  return getBranches(path)
    .then((allBranches) => {
      return allBranches.filter((branch) => branch.startsWith(prefix))
    })
    .then((branches) => {
      return branches.map((branch) => {
        return branch.substr(prefix.length)
      })
    })
}

export function getLocalBranches(path) {
  return getPrefixedBranches(path, 'refs/heads/')
}

export function getRemoteBranches(path) {
  return getPrefixedBranches(path, 'refs/remotes/')
}

export function getCurrentBranch(path) {
  return nodegit.Repository.open(path)
    .then((repo) => {
      return repo.getCurrentBranch()
    })
    .then((branch) => {
      if (branch.isBranch()) {
        return branch.name().replace('refs/heads/', '')
      } else {
        return null
      }
    })
}
