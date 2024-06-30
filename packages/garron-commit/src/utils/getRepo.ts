import gitconfig from 'gitconfig';

const gitHubRepoRegEx =
  /^https?:\/\/github\.com\/(.+?)\/(.+?)\.git$|^git@github\.com:(.+?)\/(.+?)\.git$/;

export default async () => {
  try {
    const config = await gitconfig.get({ location: 'local' });

    const repoUrl = config?.remote?.origin?.url;

    if (!repoUrl) return;

    const match: any = gitHubRepoRegEx.exec(repoUrl);

    const [owner, repoName] = match.slice(3);

    return {
      owner,
      repoName,
    };
  } catch {
    return;
  }
};
